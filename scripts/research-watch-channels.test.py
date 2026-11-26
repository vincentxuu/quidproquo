import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('watch_channels', Path(__file__).with_name('research-watch-channels.py'))
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)
REQUEST = {'id': 'channel-test', 'url': 'https://www.youtube.com/channel/UCexample', 'source_id': 'src_test'}


class ChannelAdapterTests(unittest.TestCase):
    def metadata(self, value):
        return SimpleNamespace(returncode=0, stdout=json.dumps(value))

    def test_malformed_entries_are_failed_not_uncaught(self):
        for data in [None, [], {'entries': [None]}, {'entries': [{'id': None, 'title': '城山'}]}]:
            with self.subTest(data=data), patch.object(adapter.subprocess, 'run', return_value=self.metadata(data)):
                result = adapter.scan(REQUEST, ['城山'], '/fake/yt-dlp')
                self.assertEqual(result['status'], 'failed')
                self.assertEqual(result['results'], [])

    def test_only_title_matches_retained_and_no_cookie_config(self):
        data = {'entries': [{'id': 'abcdefghijk', 'title': '城山 route'}, {'id': '12345678901', 'title': 'different crag'}]}
        with patch.object(adapter.subprocess, 'run', return_value=self.metadata(data)) as run:
            result = adapter.scan(REQUEST, ['城山'], '/fake/yt-dlp')
        self.assertEqual(result['status'], 'ok')
        self.assertEqual(len(result['results']), 1)
        self.assertEqual(result['query'], REQUEST['url'] + '/videos')
        args = run.call_args.args[0]
        self.assertIn('--ignore-config', args)
        self.assertIn('--flat-playlist', args)
        self.assertNotIn('--cookies', args)
        self.assertEqual(run.call_args.kwargs['timeout'], 50)

    def test_missing_tool_is_explicit_failure(self):
        self.assertEqual(adapter.scan(REQUEST, ['城山'], None)['status'], 'failed')

    def run_main(self, watch):
        with tempfile.TemporaryDirectory() as directory:
            plan = Path(directory) / 'plan.json'
            output = Path(directory) / 'results.json'
            plan.write_text(json.dumps({'watch': watch, 'requests': [{**REQUEST, 'kind': 'channel'}]}))
            data = {'entries': [{'id': 'abcdefghijk', 'title': 'Agent evaluation workshop'},
                                {'id': '12345678901', 'title': 'Different topic'}]}
            with patch('sys.argv', ['research-watch-channels.py', '--plan', str(plan), '--output', str(output)]), \
                    patch.object(adapter.shutil, 'which', return_value='/fake/yt-dlp'), \
                    patch.object(adapter.subprocess, 'run', return_value=self.metadata(data)), \
                    patch('builtins.print'):
                adapter.main()
            return json.loads(output.read_text())['requests'][0]

    def test_generic_plan_without_geography_writes_successful_unfiltered_metadata(self):
        result = self.run_main({'id': 'ai-agents', 'context_terms': ['AI agents']})
        self.assertEqual(result['status'], 'ok')
        self.assertEqual(len(result['results']), 2)
        self.assertIn('no title/location filter', result['coverage'])
        self.assertTrue(all('topic relevance' in row['reason'] for row in result['results']))

    def test_optional_title_filter_and_explicit_empty_override(self):
        self.assertEqual(len(self.run_main({'title_terms': ['evaluation']})['results']), 1)
        self.assertEqual(len(self.run_main({'place_terms': ['evaluation']})['results']), 1)
        self.assertEqual(len(self.run_main({'title_terms': [], 'place_terms': ['missing']})['results']), 2)

    def test_malformed_optional_filter_is_rejected(self):
        for terms in [None, 'evaluation', [''], [12]]:
            with self.subTest(terms=terms), self.assertRaises(ValueError):
                self.run_main({'title_terms': terms})

    def test_non_youtube_urls_rejected_before_execution(self):
        with patch.object(adapter.subprocess, 'run') as run:
            with self.assertRaises(ValueError):
                adapter.scan({**REQUEST, 'url': 'https://example.org/private'}, ['城山'], '/fake/yt-dlp')
            run.assert_not_called()


if __name__ == '__main__':
    unittest.main()
