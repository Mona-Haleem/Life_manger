import { Card } from "../ui/card";

interface DefaultCardProps {
  children: React.ReactNode;
  header?: string;
  className?: string;
  actions?: React.ReactNode;
}
export const DefaultCard = ({
  children,
  header,
  className,
  actions,
}: DefaultCardProps) => {
  return (
    <Card
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 transition-all duration-300 border-0 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-start font-bold text-lg text-gray-800 dark:text-gray-200">
          {header}
        </h2>
        {actions}
      </div>
      {children}
    </Card>
  );
};
