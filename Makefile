pushall:
	git push origin master

lint:
	eslint .

merge-pdfs:
	pdfconcat -o merged.pdf tools/pdfs/*.pdf

setup: install-pdf-to-html setup-dirs
	chmod u+x convert-pdfs-to-html.sh 

setup-dirs:
	mkdir -p 2016/html

install-pdf-to-html:
	brew install pdftohtmlex

get-everything-into-html:
	./convert-pdfs-to-html.sh
	cp 2016/*.html 2016/html
