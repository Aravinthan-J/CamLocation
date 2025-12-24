const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Config plugin to fix Android 12+ compatibility
 * Adds maxSdkVersion to deprecated storage permissions
 */
const withAndroid12Permissions = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const permissions = androidManifest.manifest["uses-permission"];

    if (permissions) {
      permissions.forEach((permission) => {
        const name = permission.$["android:name"];

        // Add maxSdkVersion to deprecated permissions
        if (name === "android.permission.WRITE_EXTERNAL_STORAGE") {
          permission.$["android:maxSdkVersion"] = "29";
        } else if (name === "android.permission.READ_EXTERNAL_STORAGE") {
          permission.$["android:maxSdkVersion"] = "32";
        }
      });
    }

    return config;
  });
};

module.exports = withAndroid12Permissions;
