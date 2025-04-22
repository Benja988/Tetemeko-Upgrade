const DashboardHeader = () => {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <div>
          <button className="bg-primary text-white px-4 py-2 rounded">Logout</button>
        </div>
      </header>
    );
  };
  
  export default DashboardHeader;
  