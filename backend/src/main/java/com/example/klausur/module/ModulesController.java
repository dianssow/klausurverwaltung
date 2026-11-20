package com.example.klausur.module;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.klausur.admin.dto.CreateModuleRequest;
import com.example.klausur.admin.dto.ModuleResponse;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ModulesController {
	
	private final ModuleService moduleService;

	    @PostMapping("/modules")
	    @ResponseStatus(HttpStatus.CREATED)
	    public ModuleResponse createModule(@Valid @RequestBody CreateModuleRequest r) {
	    	return  moduleService.createModule(r);
	    }
	   

}
