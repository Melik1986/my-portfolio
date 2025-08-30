// Mock для GSAP
const gsap = {
  registerPlugin: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
    clear: jest.fn().mockReturnThis(),
    totalDuration: jest.fn(() => 1),
  })),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  killTweensOf: jest.fn(),
  context: jest.fn((callback) => {
    callback();
    return {
      revert: jest.fn(),
    };
  }),
  matchMedia: jest.fn(() => ({
    add: jest.fn(),
    revert: jest.fn(),
  })),
  config: jest.fn(),
};

// Mock ScrollTrigger
const ScrollTrigger = {
  create: jest.fn(() => ({
    kill: jest.fn(),
    refresh: jest.fn(),
  })),
  refresh: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(() => []),
  batch: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  clearScrollMemory: jest.fn(),
  killAll: jest.fn(),
};

// Mock ScrollSmoother
const ScrollSmoother = {
  create: jest.fn(() => ({
    smooth: jest.fn(),
    effects: jest.fn(),
    kill: jest.fn(),
    scrollTo: jest.fn(),
    scrollTop: jest.fn(),
    paused: jest.fn(),
  })),
  get: jest.fn(() => ({
    smooth: jest.fn(),
    effects: jest.fn(),
    kill: jest.fn(),
    scrollTo: jest.fn(),
    scrollTop: jest.fn(),
    paused: jest.fn(),
  })),
};

// Mock SplitText
const SplitText = jest.fn((element, options) => ({
  chars: [],
  words: [],
  lines: [],
  revert: jest.fn(),
}));

// Mock ScrollToPlugin
const ScrollToPlugin = {};

module.exports = gsap;
module.exports.gsap = gsap;
module.exports.ScrollTrigger = ScrollTrigger;
module.exports.ScrollSmoother = ScrollSmoother;
module.exports.SplitText = SplitText;
module.exports.ScrollToPlugin = ScrollToPlugin;
module.exports.default = gsap;