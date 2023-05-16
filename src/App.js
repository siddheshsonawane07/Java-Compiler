import Home from "./Components/Home";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Home />;
    </ChakraProvider>
  );
}

export default App;
