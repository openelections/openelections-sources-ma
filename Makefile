pushall:
	git push origin master

lint:
	eslint .

merge-pdfs:
	pdfconcat -o merged.pdf tools/pdfs/*.pdf

setup: install-pdf-to-html setup-dirs
	chmod u+x convert-pdfs-to-html.sh
	chmod u+x convert-html-to-csv.sh

setup-dirs:
	mkdir -p 2016/html
	mkdir -p 2016/csv

install-pdf-to-html:
	brew install pdftohtmlex

get-everything-into-html:
	./convert-pdfs-to-html.sh
	cp 2016/*.html 2016/html

get-html-into-csv:
	./convert-html-to-csv.sh
