#!/bin/bash

# Скрипт для запуска всех тестов 3D Avatar
# Использование: ./scripts/test-3d-avatar.sh [unit|integration|e2e|all]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода заголовков
print_header() {
    echo -e "\n${YELLOW}=== $1 ===${NC}\n"
}

# Функция для проверки результата
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2 прошли успешно${NC}"
    else
        echo -e "${RED}✗ $2 провалились${NC}"
        exit 1
    fi
}

# Определяем какие тесты запускать
TEST_TYPE=${1:-all}

# Запуск unit тестов
run_unit_tests() {
    print_header "Unit тесты для 3D Avatar"
    
    echo "Запуск тестов useAvatar хука..."
    npm test -- src/modules/AboutSection/hooks/__tests__/useAvatar.test.ts
    check_result $? "Unit тесты useAvatar"
    
    echo -e "\nЗапуск тестов конфигурации..."
    npm test -- src/modules/AboutSection/config/__tests__/avatar3d.config.test.ts
    check_result $? "Unit тесты конфигурации"
}

# Запуск интеграционных тестов
run_integration_tests() {
    print_header "Интеграционные тесты для 3D Avatar"
    
    echo "Запуск тестов компонента 3DAvatar..."
    npm test -- src/modules/AboutSection/components/3DAvatar/__tests__/3DAvatar.test.tsx
    check_result $? "Интеграционные тесты"
}

# Запуск E2E тестов
run_e2e_tests() {
    print_header "E2E тесты для 3D Avatar"
    
    echo "Запуск тестов рендеринга..."
    npx playwright test tests/e2e/avatar-3d-render.spec.ts
    check_result $? "E2E тесты рендеринга"
    
    echo -e "\nЗапуск тестов производительности..."
    npx playwright test tests/e2e/avatar-performance.spec.ts
    check_result $? "E2E тесты производительности"
    
    echo -e "\nЗапуск тестов обработки ошибок..."
    npx playwright test tests/e2e/avatar-error-handling.spec.ts
    check_result $? "E2E тесты обработки ошибок"
}

# Генерация отчета о покрытии
generate_coverage_report() {
    print_header "Генерация отчета о покрытии"
    
    npm test -- --coverage \
        --collectCoverageFrom="src/modules/AboutSection/**/*.{ts,tsx}" \
        --coveragePathIgnorePatterns="<rootDir>/src/modules/AboutSection/**/*.test.{ts,tsx}" \
        src/modules/AboutSection/
}

# Основная логика
echo -e "${GREEN}🧪 3D Avatar Test Suite${NC}"
echo "=========================="

case $TEST_TYPE in
    unit)
        run_unit_tests
        ;;
    integration)
        run_integration_tests
        ;;
    e2e)
        run_e2e_tests
        ;;
    coverage)
        generate_coverage_report
        ;;
    all)
        run_unit_tests
        run_integration_tests
        run_e2e_tests
        generate_coverage_report
        ;;
    *)
        echo -e "${RED}Неизвестный тип теста: $TEST_TYPE${NC}"
        echo "Использование: $0 [unit|integration|e2e|coverage|all]"
        exit 1
        ;;
esac

echo -e "\n${GREEN}✓ Все тесты завершены успешно!${NC}"