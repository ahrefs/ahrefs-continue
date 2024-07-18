import os from "os";

export class Telemetry {
  // Set to undefined whenever telemetry is disabled
  static serverUrl?: string = "https://your-server-url.com/telemetry";
  static uniqueId: string = "NOT_UNIQUE";
  static os: string | undefined = undefined;
  static extensionVersion: string | undefined = undefined;

  static async capture(event: string, properties: { [key: string]: any }) {
    if (Telemetry.serverUrl) {
      const data = {
        distinctId: Telemetry.uniqueId,
        event,
        properties: {
          ...properties,
          os: Telemetry.os,
          extensionVersion: Telemetry.extensionVersion,
        },
      };

      try {
        const response = await fetch(Telemetry.serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error(`Failed to send telemetry data: ${response.statusText}`);
        }
      } catch (e) {
        console.error(`Failed to send telemetry data: ${e}`);
      }
    }
  }

  static async setup(
    allow: boolean,
    uniqueId: string,
    extensionVersion: string,
    serverUrl?: string
  ) {
    Telemetry.uniqueId = uniqueId;
    Telemetry.os = os.platform();
    Telemetry.extensionVersion = extensionVersion;

    if (!allow) {
      Telemetry.serverUrl = undefined;
    } else {
      Telemetry.serverUrl = serverUrl || Telemetry.serverUrl;
    }
  }
}
