import prod from './config.prod';
import dev from './config.dev';

let config = {};

if (process.env.NODE_ENV === 'development') {
    config = dev;
}
if (process.env.NODE_ENV === 'production') {
    config = prod;
}

export default config;
