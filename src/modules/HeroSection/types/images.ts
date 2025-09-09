export type HeroAvatarImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type HeroAvatarImages = {
  desktop: HeroAvatarImage;
  mobile: HeroAvatarImage;
  retina: HeroAvatarImage;
  ultrawide: HeroAvatarImage;
};
