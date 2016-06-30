package tek.microservices.manager.dao;

import static tek.microservices.manager.dao.ManagerSql.CREATE;

import org.springframework.jdbc.core.JdbcTemplate;

import tek.microservices.manager.domain.Manager;

public class ManagerDao {

    private final JdbcTemplate jdbcTemplate;
    
    public ManagerDao(JdbcTemplate jdbcTemplate) {
    	this.jdbcTemplate = jdbcTemplate;
    }
    
	public void createManager(Manager manager) {
		jdbcTemplate.execute(CREATE.sql(manager));
	}
}
