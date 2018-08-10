package com.aka.learn.mongodb;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class HelloWorldFreemarkerStyle {
    public static void main(String[] args) {
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_20);
        configuration.setClassForTemplateLoading(HelloWorldFreemarkerStyle.class, "/");

        try {
            Template template = configuration.getTemplate("hello.ftl");
            Map<String, Object> map = new HashMap<>();
            map.put("name", "Freemarker");

            StringWriter writer = new StringWriter();
            template.process(map, writer);
            System.out.println(writer);
        } catch (IOException | TemplateException e) {
            e.printStackTrace();
        }
    }
}
