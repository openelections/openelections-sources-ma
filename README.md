# openelections-sources-ma
Original results source documents for Massachusetts elections

# Development

To set up the conversion tools, run:

    make setup

This will install [pdftohtmlex](http://https://github.com/coolwanglu/pdf2htmlEX/) on your machine (sorry just on OS X for now) and set up directories and file permissions.

To convert the pdfs to html (and copy over the already html files) into `2016/html`, run:

    make get-everything-into-html
