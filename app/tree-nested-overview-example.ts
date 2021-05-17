import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable } from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { BehaviorSubject } from "rxjs";

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FoodNode {
  name: string;
  id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: "Fruit",
    children: [
      { name: "Apple", id: 1 },
      { name: "Banana", id: 2 },
      { name: "Fruit loops", id: 3 }
    ]
  },
  {
    name: "Vegetables",
    children: [
      {
        name: "Green",
        children: [
          { name: "Broccoli", id: 4 },
          { name: "Brussel sprouts", id: 5 }
        ]
      },
      {
        name: "Orange",
        children: [{ name: "Pumpkins", id: 6 }, { name: "Carrots", id: 7 }]
      }
    ]
  }
];

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: "tree-nested-overview-example",
  templateUrl: "tree-nested-overview-example.html",
  styleUrls: ["tree-nested-overview-example.css"]
})
export class TreeNestedOverviewExample {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor() {
    this.dataSource.data = TREE_DATA;
    Object.keys(this.dataSource.data).forEach(x => {
      this.setParent(this.dataSource.data[x], null);
    });
  }

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;
  setParent(data, parent) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach(x => {
        this.setParent(x, data);
      });
    }
  }

  checkAllParents(node) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every(child => child.selected);
      node.parent.indeterminate = descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }
  todoItemSelectionToggle(checked, node) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach(x => {
        this.todoItemSelectionToggle(checked, x);
      });
    }
    this.checkAllParents(node);
  }
  submit() {
    let result = [];
    this.dataSource.data.forEach(node => {
      result = result.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id)
          .map(x => x.id)
      );
    });
    console.log(result);
  }
}

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
