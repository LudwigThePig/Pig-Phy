interface SizeAndDevice {
  mobile: string;
  tablet: string;
  laptop: string;
}

const size: SizeAndDevice = {
  mobile: '320px',
  tablet: '750px',
  laptop: '1024px',
};

const device: SizeAndDevice = {
  mobile: `screen and (min-width: ${size.mobile})`,
  tablet: `screen and (min-width: ${size.tablet})`,
  laptop: `screen and (min-width: ${size.laptop})`,
};

export default device;