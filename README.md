# Realtime Chat System

## Overview
This project is a real-time chat system built with NestJS.

The main goal is to explore backend system design, especially problems related to scalability, concurrency, and performance in real-time applications.

Instead of focusing on features, this project focuses on how systems behave under load and how to design them properly.

---

## Objectives

- Handle multiple concurrent connections
- Reduce message delivery latency
- Design a system that can scale horizontally
- Understand basic distributed system patterns
- Measure and improve performance

---

## Tech Stack

- NestJS (TypeScript)
- WebSocket (Socket.IO)
- PostgreSQL
- Redis (for caching and pub/sub)

Planned:
- BullMQ or RabbitMQ (message queue)
- Docker (multi-instance deployment)

---

## Key Concepts

- WebSocket: persistent connection for real-time communication  
- Concurrency: handling multiple users at the same time  
- Redis: in-memory data store used for fast access and pub/sub  
- Pub/Sub: message distribution across multiple services  
- Message Queue: async processing (background jobs)  
- Horizontal Scaling: adding more server instances  
- Latency: delay between sending and receiving messages  
- Memory Leak: unreleased memory over time  

---

## Development Plan

### Phase 1
- Basic WebSocket gateway
- Send/receive messages
- Simple room handling

### Phase 2
- Redis pub/sub
- Multiple instances

### Phase 3
- Message queue
- Failure handling

### Phase 4
- Load testing
- Performance tuning

---

## Current Status

Work in progress

- [ ] Setup project
- [ ] WebSocket gateway
- [ ] Chat flow
- [ ] Room management
- [ ] Redis integration

---

## Notes

This project is used to practice building a system that can handle real-world load, not just a simple chat application.

Focus is on:
- system behavior under load
- architecture decisions
- performance trade-offs