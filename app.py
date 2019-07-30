import json
import sqlite3
from flask import Flask, render_template


App = Flask(__name__)

@App.route('/api/toc')
def api_toc():
	toc_sql = 'select id, parentid, name from docs'
	cur = get_cursor()
	cur.execute(toc_sql)
	result = cur.fetchall()

	toc = generate_toc(result)

	response = json_response(toc)
	return response

@App.route('/api/page/<page_id>')
def api_page(page_id):
	page_sql = 'select name, content from docs where id = ?'
	cur = get_cursor()
	cur.execute(page_sql, (page_id,))
	name, content = cur.fetchone()
	result = {
		'name': name,
		'content': content,
	}
	response = json_response(result)
	return response

@App.route('/')
def index():
	return render_template('index.html')

@App.route('/<path:pg>')
def page(pg):
	return render_template('index.html')

def get_cursor():
	conn = sqlite3.connect('docs.db')
	cur = conn.cursor()
	return cur


def generate_toc(pages):
	index = next(page for page in pages if page[0] == 'ASGR_ROOT')
	index_page = {
		'id': index[0],
		'name': index[2],
	}
	toc = generate_toc_branch(index_page, pages)
	return toc

def generate_toc_branch(page, pages):
	children = list(
		filter(
			lambda check: check[1] == page['id'],
			pages
		)
	)

	if len(children):
		page['children'] = []

	for child in children:
		child_page = {'id': child[0], 'name': child[2]}
		child_page = generate_toc_branch(child_page, pages)
		page['children'].append(child_page)

	return page

def json_response(body):
	return App.response_class(
        response=json.dumps(body),
        status=200,
        mimetype='application/json',
    )

if __name__ == '__main__':
	App.run()
