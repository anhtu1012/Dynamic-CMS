import { AxiosService } from "@/apis/axios.base";

class DynamicServicesBase extends AxiosService {
  protected readonly basePath = "/collection-schemas";
}

const DynamicServices = new DynamicServicesBase();
export default DynamicServices;
