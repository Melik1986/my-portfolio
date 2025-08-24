export interface PreloaderConfig {
  /**
   * CSS-селектор прогресс-бара, по завершению анимации которого прелоадер считается завершённым
   */
  progressBarSelector?: string;
}

export interface LoaderHookState {
  /** Флаг, что анимации завершены и прелоадер можно скрыть для скрин-ридеров */
  isHidden: boolean;
}

export interface LoaderHookResult extends LoaderHookState {
  /**
   * Пропсы для корневого контейнера прелоадера для повышения доступности
   */
  containerProps: Record<string, unknown>;
}

export interface LoaderProps {
  /** Конфигурация поведения хука */
  config?: PreloaderConfig;
}
