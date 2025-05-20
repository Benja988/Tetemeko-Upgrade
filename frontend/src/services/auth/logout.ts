import axios from "axios";
import { toast } from "sonner";

export const logout = (router: any) => { // Accept router as a parameter
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
  
  toast.info("Logged out successfully.");
  router.push("/admin/login");
};
