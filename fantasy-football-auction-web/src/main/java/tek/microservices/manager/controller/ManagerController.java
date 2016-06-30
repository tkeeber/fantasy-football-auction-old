package tek.microservices.manager.controller;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import tek.microservices.manager.dao.ManagerDao;
import tek.microservices.manager.domain.Manager;

@RestController
@RequestMapping("/manager")
public class ManagerController{

    private final ManagerDao managerDao;

    @Autowired
    public ManagerController(ManagerDao managerDao) {
		this.managerDao = managerDao;
    }

    @RequestMapping(value = "/", method = PUT)
    @ResponseStatus(CREATED)
    public void create(@NotNull @RequestBody String name) {
    	managerDao.createManager(new Manager(name));
    }
}
