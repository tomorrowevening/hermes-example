// @ts-ignore
// export const IS_DEV = import.meta.env.MODE === 'development';
export const IS_DEV = true;
export const IS_EDITOR = IS_DEV && document.location.hash.search('editor') > -1;
