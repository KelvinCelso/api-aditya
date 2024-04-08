import { serverHttp } from "./app";

const port = process.env.PORT;
serverHttp.listen(port, () => console.log(`listening on port: ${port}`));
