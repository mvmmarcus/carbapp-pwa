import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [descriptorWriteValue, setDescriptorWriteValue] = useState("");
  const [descriptor, setDescriptor] = useState(null);

  useEffect(() => {}, []);

  function onReadButtonClick() {
    console.log("Requesting any Bluetooth Device...");
    navigator.bluetooth
      .requestDevice({
        // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true,
        optionalServices: ["00001808-0000-1000-8000-00805f9b34fb"],
      })
      .then((device) => {
        console.log("Connecting to GATT Server...");
        return device.gatt.connect();
      })
      .then((server) => {
        console.log("Getting Service...");
        return server.getPrimaryService("00001808-0000-1000-8000-00805f9b34fb");
      })
      .then((service) => {
        console.log("Getting Characteristic...");
        return service.getCharacteristic(
          "00002a52-0000-1000-8000-00805f9b34fb"
        );
      })
      .then((characteristic) => {
        console.log("Getting Descriptor...");
        return characteristic.getDescriptor(
          "00002902-0000-1000-8000-00805f9b34fb"
        );
      })
      .then((descriptor) => {
        setDescriptor(descriptor);
        console.log("Reading Descriptor...");
        return descriptor.readValue();
      })
      .then((value) => {
        let decoder = new TextDecoder("utf-8");
        console.log(
          "> Characteristic Client Description: " + decoder.decode(value)
        );
      })
      .catch((error) => {
        console.log("Argh! " + error);
      });
  }

  function onWriteButtonClick() {
    if (!descriptor) {
      return;
    }
    let encoder = new TextEncoder("utf-8");
    console.log("Setting Characteristic User Description...");
    descriptor
      .writeValue(encoder.encode(descriptorWriteValue))
      .then((_) => {
        console.log(
          "> Characteristic User Description changed to: " +
            descriptorWriteValue
        );
      })
      .catch((error) => {
        console.log("Argh! " + error);
      });
  }

  return (
    <div className="App">
      <p>
        <input
          id="service"
          type="text"
          list="services"
          autofocus
          placeholder="Bluetooth Service"
        />
        <input
          id="characteristic"
          type="text"
          list="characteristics"
          placeholder="Bluetooth Characteristic"
        />
        <button id="readButton" onClick={onReadButtonClick}>
          Get Characteristic User Description
        </button>
      </p>

      <p>
        <input
          id="description"
          type="text"
          placeholder="Characteristic User Description"
          onChange={(event) => setDescriptorWriteValue(event.target.value)}
        />
        <button id="writeButton" onClick={onWriteButtonClick}>
          Set Characteristic User Description
        </button>
      </p>
    </div>
  );
}

export default App;
