---
layout: post
title: 'Dockerfile: Difference between ENTRYPOINT and CMD'
date: 2021-02-24 23:05 -0500
categories:
- Learning
tags:
- Docker
- DevOps
author: Yu-Yueh Liu
---

I have been working with Docker for over a year now but there are still a lot of things that I do not understand, and things that I thought I knew but were wrong such as the difference between ENTRYPOINT and CMD instructions in Dockerfiles.

I always thought the only difference was that CMD can be overriden and that they were mutually exclusive since Docker containers needed a starting process. In fact, they are not mutually exclusive and understanding the difference between them could be very useful when building Dockerfiles!

## Docker ENTRYPOINT
An ENTRYPOINT is used to configure a container to run as an executable and it has two forms:   

The ***exec*** form (preferred):   
```Bash
ENTRYPOINT ["executable", "param1", "param2"]
```

Command line arguments provided to `docker run <image>` will be appended after all elements of the array. For example, if you need to provide a third parameter to the above ENTRYPOINT, you can run `docker run <image> param3`. Moreover, it is possible to override the ENTRYPOINT using `docker run --entrypoint`. The exec form is parsed as a JSON array, which means that you must use double-quotes (") around words not single-quotes (') and backslashes need to be escaped.

The ***shell*** form:   
```Bash
ENTRYPOINT command param1 param2
```

This form prevents any command line arguments to be provided to the ENTRYPOINT and will start the executable as a subcommand of `/bin/sh -c`. The executable will not be run with process ID (PID) 1 and it will not pass Unix signals.


## Docker CMD
A CMD is used to provide defaults for an executing container. The defaults can be an executable, command and/or parameters. Unlike ENTRYPOINT, CMD has 3 forms:   


The ***exec*** form (preferred):   
```Bash
CMD ["executable", "param1", "param2"]
```

Although it looks similar to the ENTRYPOINT exec form, command line arguments provided to `docker run <image>` will override the default CMD defined in the Dockerfile.


The ***default arguments*** form (used with ENTRYPOINT):   
```Bash
 CMD ["param1", "param2"]
```

This form is used when both ENTRYPOINT and CMD instructions are specified. ENTRYPOINT will define the executable and parameters to run, whereas CMD will define additional default parameters, overridable by command line arguments provided to `docker run <image>`.


The ***shell*** form:   
```Bash
 CMD command param1 param2
```

Similar to the exec form, command line arguments provided to `docker run <image>` will override the default CMD defined in the Dockerfile. However, the shell form will invoke a command shell and allow normal shell processing such as variable substitution.


## Conclusion
Both ENTRYPOINT and CMD instructions allow containers to run as executable but they are not mutually exclusive. If you need to override the default executable, then you might want to use CMD. If you would like your container to run the same executable every time, then you should consider using ENTRYPOINT with CMD.

The table below describes the behaviour of ENTRYPOINT with CMD:

| dockerfile ENTRYPOINT | dockerfile CMD | docker run -\-entrypoint | docker run command | Actual command run
|:--------------------:|:--------------:|:------------------------:|:------------------:|:-----------------------:
| [exec-1]             | [foo bar]      | \<not set\>              | \<not set\>        | [exec-1 foo bar]
| [exec-1]             | [foo bar]      | [exec-2]                 | \<not set\>        | [exec-2]
| [exec-1]             | [foo bar]      | \<not set\>              | [zoo boo]          | [exec-1 zoo boo]
| [exec-1]             | [foo bar]      | [exec-2]                 | [zoo boo]          | [exec-2 zoo boo]


## References
* **[ENTRYPOINT Dockerfile reference][entrypoint-ref]**
* **[CMD Dockerfile reference][cmd-ref]**
* **[Docker Entrypoint vs CMD: Solving the Dilemma][entrypoint-vs-cmd]**
* **[Kubernetes Command and Arguments for a Container][k8s-cmd-args]**

[entrypoint-ref]: https://docs.docker.com/engine/reference/builder/#entrypoint
[cmd-ref]: https://docs.docker.com/engine/reference/builder/#cmd
[entrypoint-vs-cmd]: https://phoenixnap.com/kb/docker-cmd-vs-entrypoint
[k8s-cmd-args]: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#notes


🐢