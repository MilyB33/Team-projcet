import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { MainLayout } from "../layouts";
import { DashboardPage } from "../views/dashboard";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<DashboardPage />} />
    </Route>
  )
);
