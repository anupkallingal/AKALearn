package com.aka.learn.mongodb;

import spark.Spark;

public class HelloWorldSparkStyle {
    public static void main(String[] args) {
        Spark.get("/", (req, res) -> "Hello World From Spark");
    }
}
