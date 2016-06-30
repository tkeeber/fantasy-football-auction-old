package tek.microservices.manager.dao;

import tek.microservices.manager.domain.Manager;

public enum ManagerSql {
	CREATE {
		@Override
		public String sql(Manager manager) {
	         return "INSERT INTO Manager (Name) VALUES ('" + manager.getName() + "');";
		}
	},
	GET_ALL {
		@Override
		public String sql(Manager manager) {
			return "SELECT * FROM Manager";
		}
	};
	
	public abstract String sql(Manager manager);
		
	
	
}
