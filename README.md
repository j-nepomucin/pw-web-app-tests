# QA Practice Web Application Automated Tests

This is a test automation project using Playwright-Typescript framework for QA practice website (https://www.qa-practice.com/). Demonstrated in this project are the many ways to utilize the vast capabilities of Playwright framework in automating end-to-end test cases. Some best practices in building automated test scaffolds and templates were applied. These scripts were written with readability, maintainability, portability and scalability in mind.

In this project you will see the following best practices implemented:
- parameterized test functions
- categorization of tests using test types sanity, smoke and regression
- use of directory tree hirarchy to group test suites
- use of OOP
- doctring style test descriptions
- well commented test steps
- descriptive naming of variables, constants, objects and methonds / functions
- test types were implemented as an Enum class to avoid using literal texts that are prone to typo error.
    ```bash
    TestType.Sanity     
    TestType.Smoke      
    TestType.Regression
    ```

This project by default uses 3 browser types, namely: chromium, firefox and webkit. These can be overriden using CLI.

## Prerequisites

- Source code editor `suggested: VS Code`
- Node.js (v16 or higher)
- npm, yarn, or homebrew (for macOS)
- Ortini report (an HTML report generator tailor made for Playwright tests)

Please refer to the list of references regarding the installation of these tools and frameworks.

## Running Tests

There are 3 ways you can run these tests:
1. **From the terminal** using npx command described in https://playwright.dev/docs/running-tests.

2. **From within VSCode**, there are 3 launch configurations which can be invoked by clicking on "Run and Debug".

    The 3 launch configurations are:
    - Run Sanity Tests - runs all tests with @sanity tag
    - Run Smoke Tests - runs all tests with @smoke tag
    - Run Regression Tests - runs all tests with @regression tag

3. **Invoking the run_tests.sh script** from the command line.

    Usage: ./run_tests.sh --headless|--headed --suite 'test-suite' --type 'test-type' --project 'project-name' --workers 'num-workers' --ortoni-report

    In command line 'test-suite' values are (case sensitive):
    - *sanity*
    - *smoke*
    - *regression*

    The third option is highly recommended. Here are some examples:
    ```bash
    # run all tests in 3 browsers and use native Playwright HTML report generator.
    ./scripts/run_tests.sh

    # run all tests in 3 browsers and use Ortoni HTML report generator.
    ./scripts/run_tests.sh --ortoni-report

    # run sanity tests in 3 browsers and use Ortoni HTML report generator.
    ./scripts/run_tests.sh --type sanity --ortoni-report

    # run smoke tests in 3 browsers and use Ortoni HTML report generator.
    ./scripts/run_tests.sh --type smoke --ortoni-report

    # run regression tests in 3 browsers and use Ortoni HTML report generator.
    ./scripts/run_tests.sh --type regression --ortoni-report

    # run regression tests in chromium and use Ortoni HTML report generator.
    ./scripts/run_tests.sh --type regression --project chromium --ortoni-report

    # run regression tests in webkit, with 1 worker and use Ortoni HTML report generator.
    ./scripts/run_tests.sh --type regression --project chromium --workers 1 --ortoni-report
    ```


## Viewing Test Reports

```bash
# View HTML report using native Playwright HTML report generator
npx playwright show-report

# View HTML report using Ortini Report
npx ortoni-report show-report
```
**Report Directory Structure**

These are the directory paths of result files:
```
├── playwright-report/  # native Playwright HTML report generator
├── ortini-report/      # all test types are executed using ortini report generator
    ├── sanity/         # sanity tests are executed using ortini report generator
    ├── smoke/          # smoke tests are executed using ortini report generator
    └── regression/     # regression tests are executed using ortini report generator
```


## Configuration

Test configuration can be found in `playwright.config.ts`.

## Project Structure

```
├── scripts/              # Shell script files
├── tests/                # TypeScript test specification files
├── utils/                # Utility, helper and common scripts written in TypeScript
├── playwright.config.ts  # Playwright configuration
└── package.json          # Project dependencies
```
## References

- [Playwright Documentation](https://playwright.dev)
- [Writing Tests Using Playwright](https://playwright.dev/docs/writing-tests)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [VS Code Documentation](https://code.visualstudio.com/docs/setup/setup-overview)
- [Ortini Report](https://www.npmjs.com/package/ortoni-report?activeTab=readme)