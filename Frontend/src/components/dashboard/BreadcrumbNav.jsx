import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '../ui/Breadcrumb';

export function BreadcrumbNav() {
  return (
    <Breadcrumb className="mb-4 pt-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="font-medium text-foreground">Dashboard</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}