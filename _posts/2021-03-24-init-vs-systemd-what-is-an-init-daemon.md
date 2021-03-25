---
layout: post
title: 'Init vs Systemd: What is an init daemon?'
date: 2021-03-23 22:20 -0500
categories:
- Learning
tags:
- DevOps
- Linux Services
label: new
author: Yu-Yueh Liu
---
As a developer, I mostly work on Linux/Unix-like operating systems such as Ubuntu. Having used such operating systems for a few years now, I feel comfortable enough to say that I am familiar with them, but there are still many things that I still don't understand. In this article, I would like to explore the difference between **Init** and **Systemd**.

I remember during my System Administrator Devops internship, I had to perform some operations on some background service. At this point, I still had no idea what services were. I had to use commands like:
```Bash
sudo service <service-name> <command>
```

Occasionally, I would see people online use `init.d` instead, which also worked.
```Bash
sudo /etc/init.d/<service-name> <command>
```
   
But why are there two commands that do exactly the same thing? Sadly, this question never crossed my mind. I was happy as long as the commands worked. That is, until I started working on Fedora CoreOS for Kubernetes and this happened:

```Bash
$ sudo service kubelet <command>
sudo: service: command not found
```

`service` is not a command?! After looking for an answer on Google, I found that the command was specific to certain Linux distributions and the solution was to use:
```Bash
sudo systemctl <command> <service-name>
```

*What!?* A third command to manage services? Yup. In fact, some Linux distributions (distros) have their own command to manage services but I'm not going to go into that. In this article, I will only to talk about `service` and `systemctl` commands used by distros that run **Init** and **Systemd** respectively. But first, we need to understand what an init daemon is.

## What is an Init Daemon?
The init daemon is the first process executed by the Linux Kernel and its process ID (PID) is always 1. Its purpose is to initialize, manage and track system services and daemons. In other words, the init daemon is the parent of all processes on the system.

## What is Init?
Init (also known as System V init, or SysVinit) is an init daemon, created in the 1980s, that defines six run-levels (system states) and maps all system services to these run-levels. This allows all services (defined as scripts) to be started in a pre-defined sequence. The next script is executed only if the current script in the sequence is executed or timed out if it gets stucked. In addition to unexpected wait during execution timeouts, starting services serially makes the system initialization process inefficient and relatively slow.

## What is Systemd?
Systemd (system daemon) is an init daemon used by modern systems and starts system services in parallel which remove unnecessary delays and speeds up the initialization process. What do I mean by parallel? Systemd uses Unit Dependencies to define whether a service **wants/requires** other services to run successfully, and Unit Order to define whether a service needs other services to be started **before/after** it.

## Conclusion
Init and Systemd are both init daemons but it is better to use the latter since it is commonly used in recent Linux Distros. My next topic will be about creating Systemd services.

🐢

## References
* **[Creating a Linux service with systemd][creating-linux-service]**
* **[How to Use Systemctl to manage Systemd Services and Units][how-to-systemctl]**
* **[The Story Behind ‘init’ and ‘systemd’][story-init-vs-systemd]**
* **[Understanding and Using Systemd][understanding-systemd]**
* **[Init vs systemd][init-vs-systemd]**
* **[Differences between SysVinit, Upstart and Systemd][sysvinit-upstart-systemd]**

[creating-linux-service]: https://medium.com/@benmorel/creating-a-linux-service-with-systemd-611b5c8b91d6
[how-to-systemctl]: https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units
[story-init-vs-systemd]: https://www.tecmint.com/systemd-replaces-init-in-linux/#:~:text=The%20init%20is%20a%20daemon,running%20till%2C%20it%20is%20shutdown.&text=systemd%20%E2%80%93%20A%20init%20replacement%20daemon,%2C%20RHEL%2C%20CentOS%2C%20etc.
[understanding-systemd]: https://www.linux.com/training-tutorials/understanding-and-using-systemd/
[init-vs-systemd]: https://wiki.cdot.senecacollege.ca/wiki/Init_vs_systemd
[sysvinit-upstart-systemd]: https://www.computernetworkingnotes.com/linux-tutorials/differences-between-sysvinit-upstart-and-systemd.html
