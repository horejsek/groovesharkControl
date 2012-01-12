
CHROME_EXT_NAME=grooveshark-control
CHROME_EXT_ZIP_ARCHIVE_NAME=$(CHROME_EXT_NAME).zip
CHROME_EXT_DIRS_AND_FILES=images\
	javascript\
	_locales\
	styles\
	views\
	manifest.json


all:
	@echo "make build-chrome-extension - Create zip archive for Chrome"

build-chrome-extension:
	rm -f $(CHROME_EXT_ZIP_ARCHIVE_NAME)
	mkdir $(CHROME_EXT_NAME)
	cp -r $(CHROME_EXT_DIRS_AND_FILES) $(CHROME_EXT_NAME)/
	zip -r -q -9 $(CHROME_EXT_ZIP_ARCHIVE_NAME) $(CHROME_EXT_NAME)/
	rm -rf $(CHROME_EXT_NAME)
