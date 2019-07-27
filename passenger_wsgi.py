import os
import sys

from app import handle_request


sys.path.insert(0, os.path.dirname(__file__))


def application(environ, start_response):
	content_type, response_code, body = handle_request(environ)
	start_response(response_code, [('Content-Type', content_type)])
	return [body.encode()]
