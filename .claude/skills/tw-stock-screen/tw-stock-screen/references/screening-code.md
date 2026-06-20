# 選股腳本骨架

三層架構：量化篩選 → LLM 定性評分 → 人工複核。

## 依賴套件

```bash
pip install FinMind anthropic pandas requests
```

## 完整腳本

```python
"""
Taiwan AI Stock Screening Pipeline
依賴：FinMind（量化數據）、Claude API（定性評分）、linkup/firecrawl（文字資料）
"""

from FinMind.data import DataLoader
import anthropic
import pandas as pd
import json

dl = DataLoader()
client = anthropic.Anthropic()  # 讀取 ANTHROPIC_API_KEY 環境變數


# ==========================================
# Layer 1：量化篩選（自動，淘汰 ~90%）
# ==========================================

def get_institutional_trend(stock_id, weeks=13):
    """外資連續買超週數（正數=買超，負數=賣超）"""
    data = dl.taiwan_stock_institutional_investors(
        stock_id=stock_id,
        start_date=pd.Timestamp.now() - pd.DateOffset(weeks=weeks)
    )
    foreign = data[data['name'] == '外陸資'].copy()
    foreign['net'] = foreign['buy'] - foreign['sell']
    foreign['week'] = pd.to_datetime(foreign['date']).dt.isocalendar().week

    weekly = foreign.groupby('week')['net'].sum()
    consecutive = 0
    for v in weekly[::-1]:
        if v > 0:
            consecutive += 1
        else:
            break
    return consecutive


def get_revenue_yoy(stock_id, quarters=4):
    """近N季營收 YoY 均值（%）"""
    data = dl.taiwan_stock_month_revenue(stock_id=stock_id)
    data['date'] = pd.to_datetime(data['date'])
    data = data.sort_values('date')
    data['yoy'] = data['revenue'].pct_change(12) * 100
    return data['yoy'].dropna().tail(quarters * 3).mean()


def quantitative_screen(stock_id, cfg=None):
    """
    回傳量化分數（0-8）。
    門檻預設值可依市場環境調整。
    """
    cfg = cfg or {
        'min_consecutive_buy_weeks': 4,   # 外資連續買超週數
        'min_revenue_yoy': 10,            # 近4季營收 YoY 均值（%）
    }

    score = 0
    try:
        weeks = get_institutional_trend(stock_id)
        yoy = get_revenue_yoy(stock_id)

        if weeks >= cfg['min_consecutive_buy_weeks']:
            score += 4
        elif weeks > 0:
            score += 2

        if yoy >= cfg['min_revenue_yoy'] * 2:
            score += 4
        elif yoy >= cfg['min_revenue_yoy']:
            score += 2

    except Exception as e:
        print(f"[{stock_id}] 量化數據取得失敗: {e}")
        return 0

    return score


# ==========================================
# Layer 2：LLM 定性評分（條件①③）
# ==========================================

SCORING_PROMPT = """你是台灣AI供應鏈產業分析師。根據以下資料，評估這家公司是否符合兩個定性條件。

【公司資料】
{context}

【評估條件】

1. 供應鏈關鍵節點（1-5分）
這家公司是否處於AI供應鏈中難以繞過的位置？
- 5分：全球唯一或前兩名，客戶必須通過這個節點
- 3分：市場重要玩家，但有2-3個可替代者
- 1分：多個競爭者，地位可被取代

2. 高替換成本（1-5分）
客戶替換這家公司的代價有多高？
- 5分：替換需要整條產線重新認證（>12個月）
- 3分：替換需要一定時間但可行（3-6個月）
- 1分：可隨時替換，幾乎無切換成本

【輸出規則】
- 只根據提供的資料評分，不要用訓練知識補充事實
- evidence 必須是資料中的原文片段或數字
- 資料不足時給 2 分以下，並在 evidence 填「資料不足」
- confidence：high（原文明確支持）/ medium（間接推斷）/ low（資料不足）

【JSON 格式】
{{
  "supply_chain_node": {{
    "score": 1,
    "evidence": "...",
    "confidence": "high"
  }},
  "switching_cost": {{
    "score": 1,
    "evidence": "...",
    "confidence": "high"
  }},
  "summary": "一句話總結這家公司的定性優勢"
}}"""


def score_qualitative(stock_id, context_text):
    """LLM 評分條件①和③，並驗證 evidence 是否在原文中"""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": SCORING_PROMPT.format(context=context_text)
        }]
    )

    result = json.loads(response.content[0].text)

    # 基本 evidence 驗證
    for key in ['supply_chain_node', 'switching_cost']:
        evidence = result[key].get('evidence', '')
        if evidence and evidence != '資料不足':
            first_words = evidence.split()[:4]
            found = any(w in context_text for w in first_words if len(w) > 1)
            if not found:
                result[key]['confidence'] = 'low'
                result[key]['flag'] = '⚠️ evidence 未在原文找到，請人工複核'

    return result


# ==========================================
# 文字資料取得層
# ==========================================

def get_context(stock_id, stock_name):
    """
    組合搜尋結果作為 LLM 輸入。
    實作依你使用的搜尋工具而定（linkup / firecrawl / jina）。
    """
    # 建議搜尋的三個角度：
    queries = [
        f"{stock_name} AI供應鏈 市占率 競爭格局 2026",
        f"{stock_name} 外資持股 法說會 護城河",
        f"{stock_name} 替換成本 認證 獨家",
    ]

    # TODO：接入你的搜尋 API
    # 範例（linkup SDK）：
    # from linkup import LinkupClient
    # lc = LinkupClient()
    # results = [lc.search(q)['results'] for q in queries]
    # return "\n\n".join([r['content'] for batch in results for r in batch[:3]])

    raise NotImplementedError("請實作搜尋 API 串接")


# ==========================================
# 主程式
# ==========================================

def run_screen(stock_list, quant_threshold=5):
    """
    stock_list: [{'id': '2383', 'name': '台光電'}, ...]
    quant_threshold: 量化分數門檻，低於此值跳過 LLM 評分
    """
    results = []

    for stock in stock_list:
        print(f"[{stock['id']}] {stock['name']} 量化篩選中...")

        q_score = quantitative_screen(stock['id'])
        if q_score < quant_threshold:
            print(f"  → 量化分數 {q_score}，跳過")
            continue

        print(f"  → 量化分數 {q_score}，進入 LLM 評分...")
        context = get_context(stock['id'], stock['name'])
        llm = score_qualitative(stock['id'], context)

        total = q_score + llm['supply_chain_node']['score'] + llm['switching_cost']['score']

        results.append({
            'id': stock['id'],
            'name': stock['name'],
            'quant': q_score,
            'node_score': llm['supply_chain_node']['score'],
            'node_conf': llm['supply_chain_node']['confidence'],
            'switch_score': llm['switching_cost']['score'],
            'switch_conf': llm['switching_cost']['confidence'],
            'summary': llm['summary'],
            'total': total,
            'flags': [
                llm['supply_chain_node'].get('flag', ''),
                llm['switching_cost'].get('flag', '')
            ]
        })

    ranked = sorted(results, key=lambda x: -x['total'])

    print("\n========== 篩選結果 ==========")
    for r in ranked:
        stars = '⭐' * (5 if r['total'] >= 16 else 4 if r['total'] >= 12 else 3)
        print(f"{stars} [{r['id']}] {r['name']} — 總分 {r['total']}")
        print(f"   節點: {r['node_score']}/5 ({r['node_conf']})  替換成本: {r['switch_score']}/5 ({r['switch_conf']})")
        print(f"   {r['summary']}")
        for flag in r['flags']:
            if flag:
                print(f"   {flag}")

    return ranked


# ==========================================
# 使用方式
# ==========================================
if __name__ == '__main__':
    # 從已知候選名單開始驗證，再擴展到全市場
    test_stocks = [
        {'id': '2383', 'name': '台光電'},
        {'id': '6239', 'name': '力成'},
        {'id': '5274', 'name': '信驊'},
        {'id': '3037', 'name': '欣興'},
    ]

    run_screen(test_stocks)
```

## 建議的推進順序

1. 先用 FinMind 跑量化層，確認篩選邏輯合理（不需 API 費用）
2. 手動準備 5-10 家公司的文字資料，測試 LLM 評分品質
3. 驗證 LLM 給出的 evidence 是否真的在原文中
4. 接入搜尋 API（linkup 或 firecrawl），自動化資料取得
5. 逐步擴大股票池

## 數據來源說明

| 用途 | 來源 | 費用 |
|---|---|---|
| 三大法人買賣超、月營收 | FinMind | 免費（歷史資料） |
| 即時籌碼、K線 | Fugle API | 免費有限額 |
| 財報、重大訊息 | 公開資訊觀測站 MOPS | 免費 |
| 新聞全文、法說會 | linkup / firecrawl | 按用量計費 |
| 完整財務資料庫 | TEJ / CMoney | 付費 |
