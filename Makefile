
SHELL=/bin/bash
PYTHON=`which python2.7`

CLOSURE_LIBRARY=libs/closure-library/
CLOSURE_COMPILER=libs/closure-compiler.jar
SELENIUM_SERVER=libs/selenium-server.jar

CHROME_EXT_NAME=grooveshark-control
CHROME_EXT_ZIP_ARCHIVE_NAME=$(CHROME_EXT_NAME).zip
CHROME_EXT_JS_DIR=groovesharkControl/javascript/
CHROME_EXT_COFFEE_SOURCES=$(CHROME_EXT_JS_DIR)*/*.coffee

all:
	@echo "make build - Create zip archive for Chrome"
	@echo "make compile - Compile Chrome Extension"
	@echo "make localdev - Init submodules, git-hooks, ..."
	@echo "make clean - Clean directory from compiled and building files"
	@echo "make install-libs - Install libs for develop"

build: clean compile
	mkdir /tmp/$(CHROME_EXT_NAME)
	cp -r groovesharkControl/* /tmp/$(CHROME_EXT_NAME)/
	find /tmp/$(CHROME_EXT_NAME)/javascript/* -not -name *.min.js | xargs rm -rf
	cd /tmp; zip -r -q -9 $(CHROME_EXT_ZIP_ARCHIVE_NAME) $(CHROME_EXT_NAME)
	mv /tmp/$(CHROME_EXT_ZIP_ARCHIVE_NAME) $(CHROME_EXT_ZIP_ARCHIVE_NAME)
	rm -rf /tmp/$(CHROME_EXT_NAME)

compile:
	coffee -cb $(CHROME_EXT_COFFEE_SOURCES)

	$(PYTHON) $(CLOSURE_LIBRARY)closure/bin/calcdeps.py \
	    --path $(CLOSURE_LIBRARY) \
	    --compiler_jar $(CLOSURE_COMPILER) \
	    --input $(CHROME_EXT_JS_DIR)libs/closure-i18n.js \
	    --input $(CHROME_EXT_JS_DIR)groovesharkControl/groovesharkControl.js \
	    --input $(CHROME_EXT_JS_DIR)groovesharkControl/progressbar.js \
	    --input $(CHROME_EXT_JS_DIR)groovesharkControl/viewUpdater.js \
	    --input $(CHROME_EXT_JS_DIR)background/background.js \
	    --input $(CHROME_EXT_JS_DIR)popup/popup.js \
	    --input $(CHROME_EXT_JS_DIR)notification/notification.js \
	    --input $(CHROME_EXT_JS_DIR)options/options.js \
	    --output_mode compiled \
	    > $(CHROME_EXT_JS_DIR)groovesharkControl.min.js;
	$(PYTHON) $(CLOSURE_LIBRARY)closure/bin/calcdeps.py \
	    --path $(CLOSURE_LIBRARY) \
	    --compiler_jar $(CLOSURE_COMPILER) \
	    --input $(CHROME_EXT_JS_DIR)contentscript/contentscript.js \
	    --output_mode compiled \
	    > $(CHROME_EXT_JS_DIR)contentscript.min.js;

test:
	coffee -cb $(CHROME_EXT_COFFEE_SOURCES)
	$(PYTHON) $(CLOSURE_LIBRARY)closure/bin/calcdeps.py \
	    --dep $(CLOSURE_LIBRARY) \
	    --path $(CHROME_EXT_JS_DIR) \
	    --output_mode deps \
	    > $(CHROME_EXT_JS_DIR)test_deps.js;
	#chromium-browser --temp-profile --allow-file-access-from-files $(CHROME_EXT_JS_DIR)alltests.html
	$(PYTHON) $(CHROME_EXT_JS_DIR)alltests.py

clean:
	rm -rf /tmp/$(CHROME_EXT_NAME) $(CHROME_EXT_ZIP_ARCHIVE_NAME)
	find $(CHROME_EXT_JS_DIR) -type f -name *.js | xargs rm -f

localdev: install-git-hooks init-submodules get-selenium-server install-libs

install-git-hooks:
	cp git-hooks/* .git/hooks/
	chmod 755 .git/hooks/

init-submodules:
	git submodule init
	git submodule update

install-libs:
	apt-get install nodejs coffeescript python2.7 chromium-browser
	wget https://raw.github.com/pypa/pip/master/contrib/get-pip.py
	python2.7 get-pip.py
	rm get-pip.py
	pip-2.7 install -U selenium

get-selenium-server:
	wget http://selenium.googlecode.com/files/selenium-server-standalone-2.18.0.jar -O $(SELENIUM_SERVER)

start-selenium-server:
	java -jar $(SELENIUM_SERVER)
