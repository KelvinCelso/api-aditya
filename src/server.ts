import { serverHttp } from "./app";
import "./websocket";

const port = process.env.PORT || 3000;
serverHttp.listen(port, () => console.log(`listening on port: ${port}`));
