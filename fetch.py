import json
import requests
import sqlite3
import time


def run():
	auth_token = get_auth_token()
	toc = get_toc(auth_token)

	conn = sqlite3.connect('docs.db')
	cur = conn.cursor()

	#create_table(cur)

	#load_toc_into_db(cur, toc)

	load_pages_into_db(auth_token, cur)

	conn.commit()

	conn.close()

def get_auth_token():
	auth_url = 'https://api.ownersmanualvw.com/bbo-token/token/create/Wvwkp7au2gw912831/lang/en-us'
	auth_res = requests.get(auth_url)
	auth_dict = json.loads(auth_res.content)
	auth_token = auth_dict['token']
	return auth_token

def get_toc(auth_token):
	toc_url = 'https://www.ownersmanualvw.com/bbo-rest/api/tree/5GE012723BB'
	toc_res = requests.get(toc_url, headers={'X-Auth-Token': auth_token})
	toc_dict = json.loads(toc_res.content)
	return toc_dict

def create_table(cur):
	create_table_sql = """create table docs (id text, parentid text, name text, content text)"""
	cur.execute(create_table_sql)
	return True

def load_toc_into_db(cur, toc):
	insert_doc_and_children(cur, toc, '')
	return True

def insert_doc_and_children(cur, doc, parentid):
	insert_sql = """insert into docs values (?,?,?,?)"""
	cur.execute(insert_sql, (doc['id'], parentid, doc['name'], '',))
	if 'children' in doc:
		for child in doc['children']:
			insert_doc_and_children(cur, child, doc['id'])

def load_pages_into_db(auth_token, cur):
	result = cur.execute('select id from docs')
	docs = result.fetchall()
	for doc in docs:
		docid = doc[0]
		if docid == 'ASGR_ROOT':
			continue
		load_page_content_into_db(auth_token, cur, docid)
		time.sleep(2)

def load_page_content_into_db(auth_token, cur, docid):
	doc_url = f'https://www.ownersmanualvw.com/bbo-rest/api/content/{docid}'
	print(docid)
	doc_res = requests.get(doc_url, headers={'X-Auth-Token': auth_token})
	if doc_res.status_code == 200:
		doc_dict = json.loads(doc_res.content)
		html = doc_dict['htmlContent']
		cur.execute('update docs set content = ? where id = ?', (html,docid,))
	else:
		print('fail!')

run()
