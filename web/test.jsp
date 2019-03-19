<%--
  Created by IntelliJ IDEA.
  User: CherryDream
  Date: 2016/9/2
  Time: 15:27
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>提交成功</title>
</head>
<body>
    <%
        String name = request.getParameter("name");
        String list = request.getParameter("list");
    %>
</body>
<script type="application/javascript">
    alert("姓名:  <%=name%>,  值:  <%=list%>");
    window.location.href = "index.html";
</script>
</html>
