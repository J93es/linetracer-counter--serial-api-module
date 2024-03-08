import "./App.css";

let devicePort;

async function setDevice() {
  const filters = [];
  // Prompt user to select an Arduino Uno device.
  try {
    devicePort = await navigator.serial.requestPort({ filters });

    const { usbProductId, usbVendorId } = devicePort.getInfo();
    await devicePort.open({ baudRate: 115200 });
  } catch {
    console.log("device is not connected");
  }
}

async function writeData(string) {
  try {
    const writer = devicePort.writable.getWriter();
    const data = new Uint8Array([string]);
    writer.write(data);

    // Allow the serial port to be closed later.
    writer.releaseLock();
  } catch {
    console.log("writing is not done");
  }
}

async function readData() {
  try {
    const reader = devicePort.readable.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // 나중에 시리얼 포트가 클로즈될 수 있도록 해준다.
        reader.releaseLock();
        break;
      }
      // value는 Uint8Array이다.
      console.log(value);
    }
  } catch {
    console.log("reading is not done");
  }
}

function App() {
  if ("serial" in navigator) {
    // The Web Serial API is supported.
    console.log("The Web Serial API is supported");
  } else {
    console.log("The Web Serial API is NOT supported");
  }

  return (
    <div className="App">
      <header className="App-header">
        <button id="connect" onClick={setDevice}>
          Connect to device
        </button>

        <button
          id="writeData1"
          onClick={() => {
            writeData("1");
          }}
        >
          write data 1
        </button>
        <button id="readData" onClick={readData}>
          read data
        </button>
      </header>
    </div>
  );
}

export default App;
