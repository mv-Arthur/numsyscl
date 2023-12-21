import React from "react";
import "./App.css";
import { Converter } from "./components/converter/Converter";
import TemporaryDrawer from "./components/sidebar/SideBar";

console.log("[App.tsx]", `Hello world from Electron ${process.versions.electron}!`);

function App() {
	return (
		<>
			<Converter />
		</>
	);
}

export default App;
