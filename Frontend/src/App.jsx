import React from "react";
import { createBrowserRouter,RouterProvider} from "react-router";
import Homepage from "./routes/homepage/index.jsx";
import SignUpPage from "./routes/signUpPage/index.jsx";
import SignInPage from "./routes/signInPage/index.jsx";
import DashboardPage from "./routes/dashboardPage/index.jsx";
import ChatPage from "./routes/chatPage/index.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import DashBoardLayout from "./layouts/dashBoardLayout/index.jsx";

let router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Homepage/>,
  // },
  // {
  //   path: "/signup",
  //   element: <SignUpPage/>,
  // },
  // {
  //   path: "/signin",
  //   element: <SignInPage/>,
  // },
  // {
  //   path: "/dashboard",
  //   element: <DashboardPage/>,
  // },
  // {
  //   path: "/chat",
  //   element: <ChatPage/>,
  // },
  {
    element:<RootLayout/>,
    children:[
      {
        path:"/",
        element:<Homepage/>
      },
      {
        path:"/signup/*",
        element:<SignUpPage/>
      },
      {
        path:"/signin/*",
        element:<SignInPage/>
      },
      {
        element:<DashBoardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<DashboardPage/>
          },
          {
            path:"/dashboard/chat/:id",
            element:<ChatPage/>
          }
        ]
      }
    ]
  }
]);


const App=()=>{
  return <RouterProvider router={router} />
}

export default App;

