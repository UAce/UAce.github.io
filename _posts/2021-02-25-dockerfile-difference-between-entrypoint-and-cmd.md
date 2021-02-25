---
layout: post
title: 'Dockerfile: Difference between ENTRYPOINT and CMD'
date: 2021-02-24 23:05 -0500
tags:
- Docker
- Dockerfile
label: new
author: Yu-Yueh Liu
---
<p>
    I have been working with Docker for over a year now but there are still a lot of things that I do not understand about, and things that I thought I knew but were wrong such as the difference between ENTRYPOINT and CMD instructions in a Dockerfile.
</p>

<p>
    I always thought the only difference was that CMD can be overriden and that they were mutually exclusive since Docker containers needed a starting process. In fact, they are not mutually exclusive and understanding the difference between them could be very useful when building Dockerfiles!
</p>

<h3>Docker ENTRYPOINT</h3>
An ENTRYPOINT is used to configure a container to run as an executable and it has two forms:<br>

<p>
    The <i><b>exec</b></i> form (preferred):<br>
    <pre class="highlight"><code>ENTRYPOINT ["executable", "param1", "param2"]</code></pre>
    Command line arguments provided to <code class="inline-code">docker run {{ '<image>' | xml_escape }}</code> will be appended after all elements of the array. For example, if you need to provide a third parameter to the above ENTRYPOINT, you can run <code class="inline-code">docker run {{ '<image>' | xml_escape }} param3</code>. Moreover, it is possible to override the ENTRYPOINT using <code class="inline-code">docker run --entrypoint</code>. The exec form is parsed as a JSON array, which means that you must use double-quotes (") around words not single-quotes (') and backslashes need to be escaped.
</p>

<p>
    The <i><b>shell</b></i> form:<br>
    <pre class="highlight"><code>ENTRYPOINT command param1 param2</code></pre>
    This form prevents any command line arguments to be provided to the ENTRYPOINT and will start the executable as a subcommand of <code class="inline-code">/bin/sh -c</code>. The executable will not be the container's PID 1 which does not pass Unix signals.
</p>


<h3>Docker CMD</h3>
A CMD is used to provide defaults for an executing container. The defaults can be an executable, command and/or parameters. Unlike ENTRYPOINT, CMD has 3 forms:<br>

<p>
    The <i><b>exec</b></i> form (preferred):<br>
    <pre class="highlight"><code>CMD ["executable", "param1", "param2"]</code></pre>
    Although it looks similar to the ENTRYPOINT exec form, command line arguments provided to <code class="inline-code">docker run {{ '<image>' | xml_escape }}</code> will override the default CMD defined in the Dockerfile.
</p>

<p>
    The <i><b>default arguments</b></i> form (used with ENTRYPOINT):<br>
    <pre class="highlight"><code>CMD ["param1", "param2"]</code></pre>
    This form is used when both ENTRYPOINT and CMD instructions are specified. ENTRYPOINT will define the executable and parameters to run, whereas CMD will define additional default parameters, overridable by command line arguments provided to <code class="inline-code">docker run {{ '<image>' | xml_escape }}</code>.
</p>

<p>
    The <i><b>shell</b></i> form:<br>
    <pre class="highlight"><code>CMD command param1 param2</code></pre>
    Similar to the exec form, command line arguments provided to <code class="inline-code">docker run {{ '<image>' | xml_escape }}</code> will override the default CMD defined in the Dockerfile. However, the shell form will invoke a command shell and allow normal shell processing such as variable substitution.
</p>


<h3>Conclusion</h3>
Both ENTRYPOINT and CMD instructions allow containers to run as executable but they are not mutually exclusive. If you need to override the default executable, then you might want to use CMD. If you would like your container to run the same executable every time, then you should consider using ENTRYPOINT with CMD.


<h3>References</h3>
<ul>
    <li><a href="https://docs.docker.com/engine/reference/builder/#entrypoint" target="_blank" class="bold">ENTRYPOINT Dockerfile reference</a></li>
    <li><a href="https://docs.docker.com/engine/reference/builder/#cmd" target="_blank" class="bold">CMD Dockerfile reference</a></li>
    <li><a href="https://phoenixnap.com/kb/docker-cmd-vs-entrypoint" target="_blank" class="bold">Docker Entrypoint vs CMD: Solving the Dilemma</a></li>
</ul>