
import unittest
import selenium
import os


class ClosureWithSeleniumTestType(type):
    def __new__(cls, name, bases, attrs):
        cls.createTestMethods(attrs)
        return type.__new__(cls, name, bases, attrs)

    @classmethod
    def createTestMethods(cls, attrs):
        urlPrefix = attrs['urlPrefix']
        for key, url in attrs['urlsToTest'].iteritems():
            attrs['test%s' % key.capitalize()] = cls.createTestMethod('%s%s' % (urlPrefix, url))

    @classmethod
    def createTestMethod(cls, url):
        return lambda self: self._testClosureUrl(url)



class GroovesharkControlTest(unittest.TestCase):
    __metaclass__ = ClosureWithSeleniumTestType

    # Must be call by Makefile on root of repository.
    urlPrefix = 'file://%s/groovesharkControl/javascript/' % os.getcwd()
    urlsToTest = {
        'background': 'background/background_test.html',
    }

    @classmethod
    def setUpClass(cls):
        cls.selenium = selenium.selenium('localhost', 4444, '*chrome', 'http://www.google.com/')
        cls.selenium.start()

    def _testClosureUrl(self, url):
        sel = self.__class__.selenium
        sel.open(url)
        sel.wait_for_condition('window.G_testRunner && window.G_testRunner.isFinished()', '5000')
        success = sel.get_eval('window.G_testRunner.isSuccess()') == 'true'
        if not success:
            report = sel.get_eval('window.G_testRunner.getReport()')
            self.fail(report)

    @classmethod
    def tearDownClass(cls):
        cls.selenium.stop()



if __name__ == '__main__':
    unittest.main(verbosity=2)
