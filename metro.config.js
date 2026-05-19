const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('avif')) {
  config.resolver.assetExts.push('avif');
}

// Firebase subpaths (firebase/auth, firebase/firestore) break under Metro's package "exports" resolution.
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
