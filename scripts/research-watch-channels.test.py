import importlib.util
import json
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

    def test_non_youtube_urls_rejected_before_execution(self):
        with patch.object(adapter.subprocess, 'run') as run:
            with self.assertRaises(ValueError):
                adapter.scan({**REQUEST, 'url': 'https://example.org/private'}, ['城山'], '/fake/yt-dlp')
            run.assert_not_called()


if __name__ == '__main__':
    unittest.main()
