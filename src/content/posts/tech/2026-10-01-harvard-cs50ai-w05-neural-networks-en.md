---
title: "Harvard CS50 AI Week 5: Neural Networks — Backpropagation, TensorFlow/Keras, CNN & Traffic Sign Classification"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, neural-networks, backpropagation, tensorflow, keras, cnn, traffic, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 6
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 6
tldr: "Week 5 enters deep learning: perceptron to multi-layer nets, backprop chain rule, loss functions, optimizers, TensorFlow/Keras modeling, CNN conv/pool. Project Traffic trains CNN to classify traffic signs."
description: "Detailed guide to Harvard CS50 AI Week 5 Neural Networks: lecture highlights, video timestamps, neural network forward/backprop math, TensorFlow/Keras Sequential/Model API, CNN architecture (conv, pool, Dropout, BatchNorm), Traffic project full training pipeline and check50 commands. Videos recorded 2020; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 5 enters deep learning: from perceptron to multi-layer neural nets, backprop chain rule for gradients, loss functions & optimizers, TensorFlow/Keras modeling, CNN conv/pool structure. Project Traffic trains CNN to classify traffic sign images.

## Lecture Video & Timestamps

YouTube: [Week 5 Neural Networks (2020 recording)](https://www.youtube.com/watch?v=Z5Jj8Q8Q8Q8)

| Timestamp | Content |
|---|---|
| 00:00–12:00 | Perceptron review, multi-layer neural nets, activation functions, universal approximation theorem |
| 12:00–28:00 | Backpropagation: chain rule derivation, computation graph, gradient flow, vectorized implementation |
| 28:00–42:00 | Loss functions: MSE, Cross-Entropy, Softmax output layer |
| 42:00–55:00 | Optimizers: SGD, Momentum, Adam, learning rate schedules |
| 55:00–1:10:00 | TensorFlow/Keras intro: Sequential, Functional API, compile/train/evaluate workflow |
| 1:10:00–1:25:00 | Convolutional Neural Networks (CNN): kernels, stride, padding, pooling, parameter sharing, receptive field |
| 1:25:00–1:38:00 | Regularization: Dropout, Batch Normalization, Data Augmentation, Early Stopping |
| 1:38:00–1:45:00 | Project intro: Traffic (CNN training for GTSRB traffic sign classification) |

> Full transcript: [Week 5 Notes](https://cs50.harvard.edu/ai/2020/notes/5/)

## Core Concepts Cheat Sheet

### Backpropagation Mathematical Core

**Forward Pass** (single layer):
```
z = W·x + b
a = σ(z)  # σ = activation function
```

**Backprop Chain Rule**:
```
∂L/∂W = ∂L/∂a · ∂a/∂z · ∂z/∂W
       = δ       · σ'(z)   · xᵀ
```
where `δ = ∂L/∂z` is the "error term", propagated backward layer by layer:
```
δᴸ = ∇ₐL ⊙ σ'(zᴸ)                          # output layer
δˡ = ((Wˡ⁺¹)ᵀ δˡ⁺¹) ⊙ σ'(zˡ)               # hidden layer
```

### Common Activations & Derivatives

| Function | Formula | Derivative | Typical Use |
|---|---|---|---|
| ReLU | max(0, z) | 1 if z>0 else 0 | Hidden layers (default) |
| Leaky ReLU | max(0.01z, z) | 0.01 if z<0 else 1 | Mitigate dying ReLU |
| Sigmoid | 1/(1+e⁻ᶻ) | σ(z)(1-σ(z)) | Binary classification output |
| Tanh | (eᶻ-e⁻ᶻ)/(eᶻ+e⁻ᶻ) | 1-tanh²(z) | Hidden layers (older) |
| Softmax | eᶻᵢ/Σeᶻⱼ | Jacobian matrix | Multi-class output |

### Loss Function Selection

| Task | Output Layer | Loss Function |
|---|---|---|
| Regression | Linear (1 neuron) | MSE = ½(y-ŷ)² |
| Binary Classification | Sigmoid (1 neuron) | Binary CE = -[y log ŷ + (1-y) log(1-ŷ)] |
| Multi-class | Softmax (C neurons) | Categorical CE = -Σ yᵢ log ŷᵢ |

### TensorFlow/Keras Basic API

```python
# Basic Sequential model
import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    x_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2,
    callbacks=[tf.keras.callbacks.EarlyStopping(patience=3)]
)

test_loss, test_acc = model.evaluate(x_test, y_test)
```

### CNN Core Layers

```python
# CNN architecture example (Traffic project style)
model = models.Sequential([
    # Input: 30x30x3 color images
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(30, 30, 3)),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(43, activation='softmax')  # GTSRB 43 classes
])
```

**Key Parameters**:
- `Conv2D(filters, kernel_size, strides, padding)`: filters=output channels, kernel_size=kernel size
- `MaxPooling2D(pool_size, strides)`: downsampling, reduces params, translation invariance
- `Flatten()`: flattens 3D feature map to 1D vector for Dense layers

---

## Project 5: Traffic — CNN Training for Traffic Sign Classification

### Task

Use German Traffic Sign Recognition Benchmark (GTSRB) subset to train CNN classifying 43 traffic sign classes. Input 30×30×3 images, output 43-class probability distribution.

### Dataset Structure

```
gtsrb/
├── train/
│   ├── 0/     # class 0 images
│   ├── 1/
│   └── ... 42/
└── test/      # test set same structure
```

### Distribution Code Highlights

```python
# traffic.py provided data loading function
def load_data(data_dir):
    """Return (images, labels); images: list of 30x30x3 numpy arrays, labels: list of int"""
    images = []
    labels = []
    for label in range(43):
        dir_path = os.path.join(data_dir, str(label))
        for file in os.listdir(dir_path):
            img = cv2.imread(os.path.join(dir_path, file))
            img = cv2.resize(img, (30, 30))
            images.append(img)
            labels.append(label)
    return np.array(images), np.array(labels)
```

### Complete Reference Implementation

```python
# traffic.py full implementation
import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
import sys

def load_data(data_dir):
    images = []
    labels = []
    for label in range(43):
        dir_path = os.path.join(data_dir, str(label))
        for file in os.listdir(dir_path):
            img = cv2.imread(os.path.join(dir_path, file))
            if img is None:
                continue
            img = cv2.resize(img, (30, 30))
            images.append(img)
            labels.append(label)
    return np.array(images, dtype=np.float32), np.array(labels)

def get_model():
    model = models.Sequential([
        # First conv block
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(30, 30, 3)),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Second conv block
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Third conv block
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Dense classification head
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(43, activation='softmax')
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python traffic.py data_dir")
    
    data_dir = sys.argv[1]
    images, labels = load_data(data_dir)
    
    # Normalize to [0,1]
    images = images / 255.0
    
    # Train/validation split
    x_train, x_test, y_train, y_test = train_test_split(
        images, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    model = get_model()
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(patience=3, factor=0.5)
    ]
    
    history = model.fit(
        x_train, y_train,
        epochs=20,
        batch_size=32,
        validation_data=(x_test, y_test),
        callbacks=callbacks,
        verbose=1
    )
    
    test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)
    print(f"Test accuracy: {test_acc:.4f}")
    
    # Save model for check50
    model.save("traffic_model.h5")

if __name__ == "__main__":
    main()
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/5/traffic.zip
unzip traffic.zip && cd traffic

# Download GTSRB dataset (link in official spec)
# Extract to gtsrb/ directory

python traffic.py gtsrb
# Training outputs loss/accuracy, final Test accuracy

# check50 loads traffic_model.h5 and evaluates on hidden test set
check50 ai50/projects/2024/x/traffic

style50 traffic.py
```

> **Note**: Traffic is a single project (not split A/B), training takes longer (depends on GPU/CPU). `check50` evaluates pre-trained model on hidden test set — ensure model architecture and save format match spec.

---

## Learning Checklist

- [ ] Can hand-write single-layer neural net forward/backprop formulas (with chain rule)
- [ ] Can explain ReLU, Sigmoid, Softmax use cases and derivative forms
- [ ] Understand which tasks MSE, Binary CE, Categorical CE correspond to
- [ ] Can build MLP and CNN models with Keras Sequential
- [ ] Understand CNN `Conv2D` `filters`, `kernel_size`, `padding`, `strides` effects
- [ ] Understand BatchNormalization, Dropout, Data Augmentation regularization mechanisms
- [ ] Traffic project passes `check50` clean (test accuracy meets threshold)

## References

- [Week 5 Neural Networks lecture page](https://cs50.harvard.edu/ai/weeks/5/) — video, slides, transcript, quiz
- [Week 5 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/5/) — primary source for this post
- [Traffic project spec](https://cs50.harvard.edu/ai/projects/5/traffic/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/traffic`
- [TensorFlow/Keras official docs](https://www.tensorflow.org/api_docs/python/tf/keras)
- [GTSRB dataset description](http://benchmark.ini.rub.de/?section=gtsrb&subsection=dataset)
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition