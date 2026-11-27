// 設計頁（/design/）的通用元件範例：src/components/ui 每個元件一個實際渲染的樣本。
// 新增 ui 元件時在這裡補一個 Demo，並把檔名加進 UI_DEMOS；沒補的會在設計頁「元件清單」標成「沒有範例」。
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/** 有範例的 src/components/ui 檔名（不含副檔名）。 */
export const UI_DEMOS = [
  'button', 'button-group', 'badge', 'input', 'input-group', 'textarea', 'select', 'switch',
  'tabs', 'card', 'separator', 'spinner', 'collapsible', 'scroll-area', 'tooltip', 'popover',
  'hover-card', 'dropdown-menu', 'dialog', 'sheet', 'command',
] as const;

function Demo({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="ds-demo" id={`ui-${name}`}>
      <h4 className="ds-demo__name"><code>ui/{name}</code></h4>
      <div className="ds-demo__stage">{children}</div>
    </section>
  );
}

export default function UiShowcase() {
  return (
    <TooltipProvider>
      <div className="ds-demo-grid">
        <Demo name="button">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button>default</Button>
            <Button size="lg">lg</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Demo>

        <Demo name="button-group">
          <ButtonGroup>
            <Button variant="outline">日</Button>
            <Button variant="outline">週</Button>
            <Button variant="outline">月</Button>
          </ButtonGroup>
        </Demo>

        <Demo name="badge">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Demo>

        <Demo name="input">
          <div className="grid gap-2">
            <Input placeholder="輸入文字" />
            <Input placeholder="停用" disabled />
            <Input aria-invalid="true" defaultValue="格式錯誤" />
          </div>
        </Demo>

        <Demo name="input-group">
          <InputGroup>
            <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
            <InputGroupInput placeholder="quidproquo.cc" />
          </InputGroup>
        </Demo>

        <Demo name="textarea">
          <Textarea placeholder="多行輸入" rows={3} />
        </Demo>

        <Demo name="select">
          <Select defaultValue="opus">
            <SelectTrigger className="w-48"><SelectValue placeholder="選擇模型" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="opus">Opus</SelectItem>
              <SelectItem value="sonnet">Sonnet</SelectItem>
              <SelectItem value="haiku">Haiku</SelectItem>
            </SelectContent>
          </Select>
        </Demo>

        <Demo name="switch">
          <label className="flex items-center gap-2 text-sm"><Switch defaultChecked /> 已啟用</label>
          <label className="mt-2 flex items-center gap-2 text-sm"><Switch /> 未啟用</label>
        </Demo>

        <Demo name="tabs">
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">總覽</TabsTrigger>
              <TabsTrigger value="b">紀錄</TabsTrigger>
              <TabsTrigger value="c">設定</TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="pt-2 text-sm text-muted-foreground">總覽內容</TabsContent>
            <TabsContent value="b" className="pt-2 text-sm text-muted-foreground">紀錄內容</TabsContent>
            <TabsContent value="c" className="pt-2 text-sm text-muted-foreground">設定內容</TabsContent>
          </Tabs>
        </Demo>

        <Demo name="card">
          <Card>
            <CardHeader>
              <CardTitle>卡片標題</CardTitle>
              <CardDescription>次要說明文字</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">卡片內容</CardContent>
            <CardFooter><Button size="sm">動作</Button></CardFooter>
          </Card>
        </Demo>

        <Demo name="separator">
          <div className="text-sm">上方</div>
          <Separator className="my-2" />
          <div className="text-sm">下方</div>
        </Demo>

        <Demo name="spinner">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> 載入中</div>
        </Demo>

        <Demo name="collapsible">
          <Collapsible>
            <CollapsibleTrigger asChild><Button variant="outline" size="sm">展開／收合</Button></CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-sm text-muted-foreground">收合起來的內容</CollapsibleContent>
          </Collapsible>
        </Demo>

        <Demo name="scroll-area">
          <ScrollArea className="h-24 rounded-md border p-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => <div key={i}>第 {i + 1} 列</div>)}
          </ScrollArea>
        </Demo>

        <Demo name="tooltip">
          <Tooltip>
            <TooltipTrigger asChild><Button variant="outline" size="sm">滑過我</Button></TooltipTrigger>
            <TooltipContent>提示文字</TooltipContent>
          </Tooltip>
        </Demo>

        <Demo name="popover">
          <Popover>
            <PopoverTrigger asChild><Button variant="outline" size="sm">開啟 Popover</Button></PopoverTrigger>
            <PopoverContent className="text-sm">浮動面板內容</PopoverContent>
          </Popover>
        </Demo>

        <Demo name="hover-card">
          <HoverCard>
            <HoverCardTrigger asChild><Button variant="link">@quidproquo</Button></HoverCardTrigger>
            <HoverCardContent className="text-sm">滑過連結時出現的預覽卡</HoverCardContent>
          </HoverCard>
        </Demo>

        <Demo name="dropdown-menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" size="sm">選單</Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>動作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>編輯</DropdownMenuItem>
              <DropdownMenuItem>複製</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">刪除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Demo>

        <Demo name="dialog">
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="sm">開啟對話框</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>確認動作</DialogTitle>
                <DialogDescription>這個動作無法復原。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">取消</Button>
                <Button variant="destructive">刪除</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Demo>

        <Demo name="sheet">
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="sm">開啟側邊面板</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>側邊面板</SheetTitle>
                <SheetDescription>從右側滑出的面板</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Demo>

        <Demo name="command">
          <Command className="rounded-md border">
            <CommandInput placeholder="搜尋指令" />
            <CommandList>
              <CommandEmpty>找不到結果</CommandEmpty>
              <CommandGroup heading="建議">
                <CommandItem>新增 session</CommandItem>
                <CommandItem>開啟設定</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Demo>
      </div>
    </TooltipProvider>
  );
}
