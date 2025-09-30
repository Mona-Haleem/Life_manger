const NotFound = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p>This page is under construction.</p>
  </div>
);
export default NotFound;