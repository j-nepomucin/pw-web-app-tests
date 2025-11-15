#!/bin/bash
# Script to run Playwright tests with configurable options
# Usage: ./run_tests.sh [--headless|--headed] [--suite <test-suite>] [--type <test-type>] [--project <project-name>] [--workers <num-workers>] [--ortoni-report]

# Default values
HEADLESS=true
UI_MODE=false
TEST_SUITE=""
TEST_TYPE="sanity_smoke_regression"  # Default to run all types
ORTONI_REPORT=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --headless)
            HEADLESS=true
            shift
            ;;
        --headed)
            HEADLESS=false
            shift
            ;;
        --ui)
            UI_MODE=true
            shift
            ;;  
        --suite)
            TEST_SUITE="$2"
            if [ -z "$2" ]; then
                echo "Error: --suite requires a test suite argument"
                exit 1
            fi
            shift 2
            ;;
        --type)
            TEST_TYPE="$2"
            if [ "$TEST_TYPE" != "sanity" ] && [ "$TEST_TYPE" != "regression" ] && [ "$TEST_TYPE" != "smoke" ]; then
                echo "Invalid test type: $TEST_TYPE"
                echo "Valid options are: sanity, regression, smoke"
                exit 1
            fi
            shift 2
            ;;
        --project)
            PROJECT="$2"
            if [ "$PROJECT" != "chromium" ] && [ "$PROJECT" != "firefox" ] && [ "$PROJECT" != "webkit" ]; then
                echo "Invalid project name: $PROJECT"
                echo "Valid options are: chromium, firefox, webkit"
                exit 1
            fi
            shift 2
            ;;
        --workers)
            WORKERS="$2"
            if ! [[ "$WORKERS" =~ ^[0-9]+$ ]]; then
                echo "Invalid number of workers: $WORKERS"
                echo "Please provide a valid integer."
                exit 1
            fi
            shift 2
            ;;
        --ortoni-report)
            ORTONI_REPORT=true
            shift
            ;;
        *)
            echo "Invalid argument: $1"
            echo "Usage: $0 [--headless|--headed] [--suite <test-suite>] [--type <test-type>] [--project <project-name>] [--workers <num-workers>] [--ortoni-report]"
            exit 1
            ;;
    esac
done

# Build the command
NPX_CMD="npx playwright test"

# Add headless/headed flag
if [ "$HEADLESS" = false ]; then
    NPX_CMD="$NPX_CMD --headed"
fi

# Add UI mode flag
if [ "$UI_MODE" = true ]; then
    NPX_CMD="$NPX_CMD --ui"
fi

# Add test suite if specified
if [ -n "$TEST_SUITE" ]; then
    NPX_CMD="$NPX_CMD $TEST_SUITE"
fi

# Add test type if specified
if [ -n "$TEST_TYPE" ] && [ "$TEST_TYPE" != "sanity_smoke_regression" ]; then
    NPX_CMD="$NPX_CMD --grep $TEST_TYPE"
fi

# Add project if specified
if [ -n "$PROJECT" ]; then
    NPX_CMD="$NPX_CMD --project=$PROJECT"
fi

# Add workers if specified
if [ -n "$WORKERS" ]; then
    NPX_CMD="$NPX_CMD --workers=$WORKERS"
fi

# Set-up report directory and use correct config
if [ "$ORTONI_REPORT" = true ]; then
    REPORT_DIR="ortoni-report"
    if [ "$TEST_TYPE" != "sanity_smoke_regression" ]; then
        REPORT_DIR="${REPORT_DIR}/${TEST_TYPE}"
    fi

    # Create report directory if it doesn't exist
    if [ ! -d "$REPORT_DIR" ]; then
        mkdir -p "$REPORT_DIR"
    fi
    
    # Set-up report folder path in config file
    TEMP_FILE=$(mktemp)
    sed "7s|.*|  folderPath: \"${REPORT_DIR}\",|" ./config_files/playwright.config_ortoni.ts > "$TEMP_FILE"
    mv "$TEMP_FILE" ./config_files/playwright.config_ortoni.ts

    # Change case of test type
    if [ "$TEST_TYPE" == "sanity" ]; then
      TEST_TYPE="Sanity"
    elif [ "$TEST_TYPE" == "regression" ]; then
      TEST_TYPE="Regression"
    elif [ "$TEST_TYPE" == "smoke" ]; then
      TEST_TYPE="Smoke"
    elif [ "$TEST_TYPE" == "sanity_smoke_regression" ]; then
      TEST_TYPE="Sanity_Smoke_Regression"
    fi

    # Set-up title in config file
    TEMP_FILE=$(mktemp)
    sed "9s|.*|  title: \"${TEST_TYPE} Test Report\",|" ./config_files/playwright.config_ortoni.ts > "$TEMP_FILE"
    mv "$TEMP_FILE" ./config_files/playwright.config_ortoni.ts  

    # Set-up test type in config file
    TEMP_FILE=$(mktemp)
    sed "12s|.*|  testType: \"${TEST_TYPE} Test\",|" ./config_files/playwright.config_ortoni.ts > "$TEMP_FILE"
    mv "$TEMP_FILE" ./config_files/playwright.config_ortoni.ts
    
    # Copy and use correct config file
    cp ./config_files/playwright.config_ortoni.ts ./playwright.config.ts

else
    # Use HTML report
    REPORT_DIR="playwright-report"
    if [ ! -d "$REPORT_DIR" ]; then
        mkdir -p "$REPORT_DIR"
    fi

    # Copy and use correct config file
    cp ./config_files/playwright.config_html.ts ./playwright.config.ts
fi

# Run the command
echo "----------------------------------------"
echo "Running: $NPX_CMD"
echo "Test Type: $TEST_TYPE"
echo "Report type: $( [ "$ORTONI_REPORT" = true ] && echo "Ortoni Report" || echo "HTML Report" )"
echo "Report Directory: ./$REPORT_DIR/"

# Execute tests
eval $NPX_CMD

# Print message after execution
if [ $? -eq 0 ]; then
    echo "Tests executed successfully."
else
    echo "There was an error executing the tests."
fi
echo "----------------------------------------"