package com.map.app.entities;

import javax.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String email;
    private String name;
    private String userName;
    private String password;
    private Integer age;
    private String sex;
    @ManyToOne
    @JoinColumn(name="status")
    private Status status;

    public User() {}

    public User(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    public User(Integer id, String email, String name, String userName, String password, Integer age, String sex) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.userName = userName;
        this.password = password;
        this.age = age;
        this.sex = sex;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
