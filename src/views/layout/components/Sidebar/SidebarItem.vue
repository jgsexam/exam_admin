<template>
  <div>
    <div v-if="!item.hidden&&hasPermission(item)" class="menu-wrapper">
      <template v-if="hasOneShowingChild(item.children,item) && (onlyOneChild.noShowingChildren)">
        <app-link :to="resolvePath(onlyOneChild.path)">
          <el-menu-item
            :index="resolvePath(onlyOneChild.path)"
            :class="{'submenu-title-noDropdown':!isNest}"
          >
            <item :meta="Object.assign({},item.meta,onlyOneChild.meta)"/>
          </el-menu-item>
        </app-link>
      </template>
      <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
        <template slot="title">
          <item :meta="item.meta"/>
        </template>
        <sidebar-item
          v-for="child in item.children"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </el-submenu>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null,
      this.authMenu = null
    return {}
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      if (showingChildren.length === 1) {
        return true
      }

      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    hasPermission (item) {
      // 判断是否拥有某个权限
      if (item.auth == null) {
        const child = item.children
        if (child.length == 0) {
          return true
        } else {
          let flag = false
          for (let index = 0; index < child.length; index++) {
            const c = child[index]
            if (this.$store.getters.auths.indexOf(c.auth) >= 0 || c.hidden) {
              flag = true
            }
          }
          return flag
        }
      }
      if (this.$store.getters.auths.indexOf(item.auth) >= 0) {
        return true
      }
      return false
    }
  }
}
</script>