package com.aka.learn.mongodb;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import spark.Spark;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class HelloWorldSparkFreemarkerStyle {
    public static void main(String[] args) {
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_20);
        configuration.setClassForTemplateLoading(HelloWorldSparkFreemarkerStyle.class, "/");

        Spark.get("/", (req, res) -> {
            StringWriter writer = new StringWriter();
            try {
                Template template = configuration.getTemplate("hello.ftl");
                Map<String, Object> map = new HashMap<>();
                map.put("name", "Freemarker");

                template.process(map, writer);
            } catch (IOException | TemplateException e) {
                Spark.halt(500);
                e.printStackTrace();
            }
            return writer;
        });
    }

}
